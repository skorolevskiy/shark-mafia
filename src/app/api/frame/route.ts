import { SITE_URL} from '@/config';
import { NextRequest, NextResponse } from 'next/server';
import {
  Address,
  Hex,
} from 'viem';
import { addUser, getUser } from './types';

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body: { trustedData?: { messageBytes?: string } } = await req.json();

    // Check if frame request is valid
    const status = await validateFrameRequest(body.trustedData?.messageBytes);

    if (!status?.valid) {
      console.error(status);
      throw new Error('Invalid frame request');
    }

    // Check if user has liked and recasted
    const hasLikedAndRecasted =
      !!status?.action?.cast?.viewer_context?.liked &&
      !!status?.action?.cast?.viewer_context?.recasted;

    if (!hasLikedAndRecasted) {
      return getResponse(ResponseType.RECAST);
    }

    // Check if user has an address connected
    const address: Address | undefined =
      status?.action?.interactor?.verifications?.[0];

    if (!address) {
      return getResponse(ResponseType.NO_ADDRESS);
    }

    const fid = status?.action?.interactor?.fid ? JSON.stringify(status.action.interactor.fid) : null;
    const username = status?.action?.interactor?.username ? JSON.stringify(status.action.interactor.username) : null;
    const power_badge = status?.action?.interactor?.power_badge ? status.action.interactor.power_badge : null;

    const User = await getUser(fid);

    if (!User) {
			await addUser(fid, username, address, power_badge);
		} else {
			return getResponse(ResponseType.SUCCESS);
		}

    return getResponse(ResponseType.SUCCESS);
  } catch (error) {
    console.error(error);
    return getResponse(ResponseType.ERROR);
  }
}

enum ResponseType {
  SUCCESS,
  RECAST,
  ALREADY_MINTED,
  NO_ADDRESS,
  ERROR,
}

function getResponse(type: ResponseType) {
  const IMAGE = {
    [ResponseType.SUCCESS]: 'status/success.png',
    [ResponseType.RECAST]: 'status/recast.png',
    [ResponseType.ALREADY_MINTED]: 'status/already-minted.png',
    [ResponseType.NO_ADDRESS]: 'status/no-address.png',
    [ResponseType.ERROR]: 'status/error.png',
  }[type];
  const shouldRetry =
    type === ResponseType.ERROR || type === ResponseType.RECAST;
  return new NextResponse(`<!DOCTYPE html><html><head>
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${SITE_URL}/${IMAGE}" />
    <meta property="fc:frame:image:aspect_ratio" content="1:1" />
    <meta property="fc:frame:post_url" content="${SITE_URL}/api/frame" />
    ${
      shouldRetry
        ? `
          <meta property="fc:frame:button:1" content="Try again" />
          <meta name="fc:frame:button:2" content="Follow Shark" />
          <meta name="fc:frame:button:2:action" content="link" />
          <meta name="fc:frame:button:2:target" content="https://warpcast.com/~/channel/sharks" />
        `
        : `
          <meta name="fc:frame:button:1" content="🔁Referral" />
          <meta name="fc:frame:button:1:action" content="link" />
          <meta name="fc:frame:button:1:target" content="https://warpcast.com/~/compose?text=Join&embeds[]=${SITE_URL}/" />

        `
    }
  </head></html>`);
}

async function validateFrameRequest(data: string | undefined) {
  if (!NEYNAR_API_KEY) throw new Error('NEYNAR_API_KEY is not set');
  if (!data) throw new Error('No data provided');

  const options = {
    method: 'POST',
    headers: {
      accept: 'application/json',
      api_key: NEYNAR_API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ message_bytes_in_hex: data }),
  };

  return await fetch(
    'https://api.neynar.com/v2/farcaster/frame/validate',
    options,
  )
    .then((response) => response.json())
    .catch((err) => console.error(err));
}
