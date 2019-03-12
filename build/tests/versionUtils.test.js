"use strict";

var _versionUtils = require("../versionUtils");

/* eslint-disable no-undef */

/* eslint-disable camelcase */
const version0_4_0_2String = '0.4.0-alpha.2';
const version1_5_2String = '1.5.2';
const version10_12_3String = '10.12.3';
const version0_4_0 = {
  major: 0,
  minor: 4,
  patch: 0,
  build: 1
};
const version0_4_0_2 = {
  major: 0,
  minor: 4,
  patch: 0,
  build: 2
};
const version1_5_2 = {
  major: 1,
  minor: 5,
  patch: 2,
  build: 1
};
const version10_12_3 = {
  major: 10,
  minor: 12,
  patch: 3,
  build: 1
};
describe('versionStringToVersion:', () => {
  it('Should match version0_4_0_2 object when version string is 0.4.0, current version is 0.4.0 and current version code is 4001', () => {
    expect((0, _versionUtils.versionStringToVersion)(version0_4_0_2String, version0_4_0, 4001)).toEqual(version0_4_0_2);
  });
  it('Should match version1_5_2 object when version string is 1.5.2', () => {
    expect((0, _versionUtils.versionStringToVersion)(version1_5_2String)).toEqual(version1_5_2);
  });
  it('Should match version10_12_3 object when version string is 10.12.3', () => {
    expect((0, _versionUtils.versionStringToVersion)(version10_12_3String)).toEqual(version10_12_3);
  });
});
describe('versionToVersionCode:', () => {
  it('Should return 4002 when version is 0.4.0-alpha.2 and build number is 2', () => {
    expect((0, _versionUtils.versionToVersionCode)(version0_4_0_2)).toBe(4002);
  });
  it('Should return 105021 when version is 1.5.2', () => {
    expect((0, _versionUtils.versionToVersionCode)(version1_5_2)).toBe(105021);
  });
  it('Should return 1012031 when version is 10.12.3', () => {
    expect((0, _versionUtils.versionToVersionCode)(version10_12_3)).toBe(1012031);
  });
});