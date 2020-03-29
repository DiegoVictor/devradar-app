import knex from 'knex';

import conf from '../../knexfile';

export default knex(conf[process.env.NODE_ENV]);
