import Spot from '../models/Spot';

class UpdateSpot {
  async run({ _id, company, file, price, techs = '', user }) {
    const data = {
      company,
      price,
      techs,
    };
    if (typeof file === 'object') {
      data.thumbnail = file.filename;
    }

    data.techs = techs.split(',').map(tech => tech.trim());

    const spot = await Spot.findOne({ _id, user });

    ['company', 'price', 'techs'].forEach(field => {
      spot[field] = data[field];
    });

    await spot.save();

    return {
      ...spot.toJSON(),
    };
  }
}

export default new UpdateSpot();
