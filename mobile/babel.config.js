module.exports = function(api) {
  api.cache(true);
  
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Retirer temporairement le plugin Reanimated pour tester
    ],
  };
};
