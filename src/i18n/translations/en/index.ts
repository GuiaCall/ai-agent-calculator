
import { general } from './general';
import { agency } from './agency';
import { client } from './client';
import { calculator } from './calculator';
import { technologies } from './technologies';
import { invoice } from './invoice';
import { auth } from './auth';
import { ui } from './ui';

export const en = {
  translation: {
    ...general,
    ...agency,
    ...client,
    ...calculator,
    ...technologies,
    ...invoice,
    ...auth,
    ...ui
  }
};
