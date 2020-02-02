import parseStringAsArray from '../helpers/parseStringAsArray';

class UpdateDeveloper {
  async run(params) {
    const { developer } = params;
    if (typeof params.techs === 'string') {
      developer.techs = parseStringAsArray(params.techs);
    }

    ['name', 'avatar_url', 'bio'].forEach(field => {
      if (typeof params[field] === 'string') {
        developer[field] = params[field];
      }
    });

    await developer.save();

    return developer;
  }
}

export default new UpdateDeveloper();
