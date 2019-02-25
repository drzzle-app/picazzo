const cleanDropletTpl = {
  methods: {
    cleanDropletTpl(str) {
      const newString = str.replace(/ picazzo-exCol/gi, '');
      return newString.replace(/ ref="(.*)"/g, '');
    },
  },
};

export { cleanDropletTpl }; // eslint-disable-line
