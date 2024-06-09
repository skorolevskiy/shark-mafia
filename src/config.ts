import { getFrameMetadata, FrameImageMetadata } from '@coinbase/onchainkit/frame';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;

export const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;

const imageData: FrameImageMetadata = {
	src: `${SITE_URL}/opengraph-image2.png`,
	aspectRatio: '1:1' // или '1.91:1'
};

export const FRAME_METADATA = getFrameMetadata({
  buttons: [{
		label: 'Join to Waitlist',
	},],
  image: imageData,
  post_url: `${SITE_URL}/api/frame`,
});
