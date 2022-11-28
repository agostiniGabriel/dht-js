import crypto from 'crypto';

class VideoDistribution {
    saveVideo(streamVideo) {
        const date = Date.now();
        const firstVideoKey = crypto.createHash('md5').update(date).digest('hex');
        return firstVideoKey;
    }
}