import dotenv from 'dotenv'
dotenv.config()

import logger from './lib/logger'
import ChssEngine from './chss_engine'

const engine = new ChssEngine()
logger.debug('Initial Engine State', engine.get_state())
