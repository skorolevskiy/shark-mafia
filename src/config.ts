import { getFrameMetadata } from '@coinbase/onchainkit/frame';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

export const FRAME_METADATA = getFrameMetadata({
  buttons: [{
		label: 'Join to Waitlist',
	},],
  image: `${SITE_URL}/opengraph-image.JPG`,
  post_url: `${SITE_URL}/api/frame`,
});
