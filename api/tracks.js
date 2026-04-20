import express from 'express';
const trackRouter = express.Router();
import {
    getTracks,
    getTrackById,
} from '#db/queries/tracks';
import { getPlaylistsByTrackId } from '#db/queries/playlists';
import requireUser from '#middleware/requireUser';

trackRouter.get('/', async (req, res) => {
    const tracks = await getTracks();
    res.send(tracks);
});

trackRouter.param('id', async (req, res, next, id) => {
    const track = await getTrackById(id);
    if (!track) {
        return res.status(404).send('Track not found by that ID.');
    }
    req.track = track;
    next();
});

trackRouter.get('/:id', (req, res) => {
    res.send(req.track);
});

trackRouter.get('/:id/playlists', requireUser, async (req, res) => {
    const playlists = await getPlaylistsByTrackId(req.track.id);
    res.send(playlists);
});

export default trackRouter;