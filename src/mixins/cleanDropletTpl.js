const cleanDropletTpl = {
  methods: {
    cleanDropletTpl(str) {
      let newString = str.replace(/ picazzo-exCol/gi, '');
      newString = newString.replace(/picazzo-myP-item /gi, '');
      return newString.replace(/ ref="(.*)"/g, '');
    },
  },
};

export { cleanDropletTpl }; // eslint-disable-line
