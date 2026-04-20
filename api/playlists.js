import express from 'express';
const playlistRouter = express.Router();
import { 
    createPlaylist,
    getPlaylists,
    getPlaylistById,
    getPlaylistsByUserId,
} from '#db/queries/playlists';
import { getTracks, getTracksByPlaylistId } from '#db/queries/tracks';
import { createPlaylistsTracks } from '#db/queries/playlists_tracks';
import requireUser from '#middleware/requireUser';
import requireBody from '#middleware/requireBody';

playlistRouter.use(requireUser);

playlistRouter.get('/', async (req, res) => {
    const playlists = await getPlaylistsByUserId(req.user.id);
    res.send(playlists);
});

playlistRouter.post('/', requireBody(['name', 'description']), async (req, res) => {
    const { name, description } = req.body;

    const playlist = await createPlaylist(name, description, req.user.id);
    res.status(201).send(playlist);
});

playlistRouter.param('id', async (req, res, next, id) => {
    const playlist = await getPlaylistById(id);
    if (!playlist) {
        return res.status(404).send('No playlist found by that ID.');
    }

    if (playlist.user_id !== req.user.id) {
        return res.status(403).send('You do not have permission to access this playlist.');
    }

    req.playlist = playlist;
    next();
});

playlistRouter.get('/:id', (req, res) => {
    res.send(req.playlist);
});

playlistRouter.get('/:id/tracks', async (req, res) => {
    const tracks = await getTracksByPlaylistId(req.playlist.id);
    res.send(tracks);
});

playlistRouter.post('/:id/tracks', requireBody(['trackId']), async (req, res) => {

    const { trackId } = req.body;

    const newPlaylistTrack = await createPlaylistsTracks(
        req.playlist.id, trackId
    );

    res.status(201).send(newPlaylistTrack);
});

export default playlistRouter;