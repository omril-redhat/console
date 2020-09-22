import { $, element, by } from 'protractor';

export const nicName = $('#nic-name');
export const defaultModel = element(by.xpath("//span[contains(text(),'virtio')]"));
export const networkDropDown = element(by.xpath("//*[contains(text(),'Select Network Attachment Definition')]"));
export const typeDropDown = element(by.xpath("//*[contains(text(),'Select Type')]"));
export const nicModel = $('#nic-model');
export const nicNetwork = $('#nic-network');
export const nicType = $('#nic-type');
export const nicMACAddress = $('#nic-mac-address');
