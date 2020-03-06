import Spot from '../models/Spot';

class UpdateSpot {
  async run({ _id, company, file, price, techs = [], user }) {
    const data = {
      company,
      price,
      techs,
    };
    if (typeof file === 'object') {
      data.thumbnail = file.filename;
    }

    data.techs = techs.split(',').map(tech => tech.trim());

    const spot = await Spot.findOneAndUpdate({ _id, user }, data);

    return {
      spot: spot.toJSON(),
      company,
      price,
      techs,
      thumbnail: data.thumbnail,
    };
  }
}

export default new UpdateSpot();
