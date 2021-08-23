import { KeyDeriverWeb } from './KeyDeriverWeb';
import LightningFS from '@isomorphic-git/lightning-fs';
import { AESWeb } from './AESWeb';

window.KeyDeriverWeb = KeyDeriverWeb;
window.LightningFS = LightningFS;
window.AESWeb = AESWeb;
window.fs = new LightningFS('git');
