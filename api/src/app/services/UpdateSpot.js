import Spot from '../models/Spot';

class UpdateSpot {
  async run({ _id, company, file, price, techs = [], user }) {
    let thumbnail = '';
    if (typeof file === 'object') {
      thumbnail = file.filename;
    }

    techs = techs.split(',').map(tech => tech.trim());

    const spot = await Spot.findOneAndUpdate(
      { _id, user },
      {
        company,
        price,
        techs,
        thumbnail,
      }
    );

    return {
      ...spot,
      company,
      price,
      techs,
      thumbnail,
    };
  }
}

export default new UpdateSpot();
