import { createPlaylist } from '#db/queries/playlists';
import { createTrack } from '#db/queries/tracks';
import { createPlaylistsTracks } from '#db/queries/playlists_tracks';

import db from "#db/client";
import { userRegister } from '#db/queries/users';

const ADJECTIVES = ['Swanky', 'Angry', 'Groovy', 'Jazzy', 'Hardcore'];
const NOUNS = ['Tunes', 'Music', 'Bops', 'Beats', 'Rhythms'];
const ACTIONS = [
  'To shake it to', 
  'To headbang to', 
  'That make me cry', 
  'That make me groove', 
  'That my dog likes'
];
const TITLE = [
  'Blarg',
  'My Cat Poops',
  'My Dog Plays Fetch',
  'I Bareknuckle Fight Pokemon',
  'Steve from Minecraft is a Coward',
  'My Dragon Ate my Spouse',
  'Frontend be Darned',
  'The Flowers Grew Tomorrow',
  'Baseball is neat',
  'The Weather Be Changing',
  'Rain is Wet',
  'If You Give a Mouse an RPG',
  'Goodnight Moon (Reprise)',
  'Coding with Friends Overture',
  'I am Running Out of Song Titles',
  'Who is the Muffin Man?',
  'I COULD Catch the Gingerbread Man',
  'There Are So Many Songs',
  'This is Getting Exhausting',
  'I Hope You Enjoyed',
];

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

function getRandom(array) {
  const index = Math.floor(Math.random() * array.length)
  return array[index]
};

async function seed() {
  for (let i = 1; i <= 20; i++) {
    const title = getRandom(TITLE);
    const ms = Math.floor(Math.random() * 60000);
    await createTrack(title, ms);
  }

  const playlists = [];
  for (let i = 1; i <= 3; i++) {
    const name = getRandom(ADJECTIVES) + ' ' + getRandom(NOUNS);
    const description = name + ' ' + getRandom(ACTIONS);
    const user = await userRegister('user' + i, 'password');
    const playlist = await createPlaylist(name, description, user.id);
    playlists.push(playlist);
  }

  for (let i = 0; i < playlists.length; i++) {
    const playlist = playlists[i];
    for (let j = 0; j < 5; j++) {
      const trackId = i * 5 + j + 1;
      if (trackId <= 20) {
        await createPlaylistsTracks(playlist.id, trackId);
      }
    }
  }
};