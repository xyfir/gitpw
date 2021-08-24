import { KeyDeriverWeb } from './KeyDeriverWeb';
import { NativeProxy } from './NativeProxy';
import LightningFS from '@isomorphic-git/lightning-fs';
import { AESWeb } from './AESWeb';
import * as git from 'isomorphic-git';

window.KeyDeriverWeb = KeyDeriverWeb;
window.NativeProxy = NativeProxy;
window.LightningFS = LightningFS;
window.AESWeb = AESWeb;
window.git = git;
window.fs = new LightningFS('git');
