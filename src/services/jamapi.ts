import {JamConfigurationService} from './jam-configuration';
import {JamService} from './jam';

const configuration = new JamConfigurationService();
const jam = new JamService(configuration);

export default jam;
