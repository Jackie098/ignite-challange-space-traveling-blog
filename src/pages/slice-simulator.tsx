/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */

'use client';

import { SliceSimulator } from '@slicemachine/adapter-next/simulator';
import { SliceZone } from '@prismicio/react';

// FIXME: path does not work1
// import { components } from '../slices';

export default function SliceSimulatorPage(): JSX.Element {
  return (
    <SliceSimulator
      sliceZone={props => <SliceZone {...props} components={{}} />}
    />
  );
}
