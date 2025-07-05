module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/__tests__'],
  collectCoverage: true,
  collectCoverageFrom: ['miniprogram/**/*.{js,wxml}', '!miniprogram/wxcharts.js'],
  coverageThreshold: {
    global: {
      lines: 80,
    },
  },
};
