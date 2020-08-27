import Base from './base';
import star from './star';
import wheel from './wheel';

import Aspect from 'phaser3-aspects';

export default Aspect.Union({
    // You can make a resource inline if you like...
    arrow: class extends Base {
        static get config() {
            return {
                data: [
                    '..BBBBBB',
                    '...BAAAB',
                    '....BAAB',
                    '...BABAB',
                    '..BAB.BB',
                    '.BAB...B',
                    '.BB.....',
                    '........',
                ],
                pixelWidth: 8,
                setXY: { x:256, y:128, stepX: 64, stepY: 64, },
            };
        }
    },
    // Or import it from another directory...
    star,
    // Or skip resources and extend the class for real.
    // You do you.
    wheel
});
