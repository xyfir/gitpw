import { writeFile, mkdir } from 'fs-extra';
import { getPath } from '../utils/getPath';
import { utimes } from 'utimes';
import SN from './sn.json';

const folders = [
  'blackhat',
  'finance',
  'glass-half-shattered',
  'music',
  'sex',
  'ideas',
  'misc',
];

export async function convertCommand(): Promise<void> {
  const tags = SN.items.filter((i) => i.content_type == 'Tag');
  const notes = SN.items.filter(
    (i) => i.content_type == 'Note' && !i.content.trashed,
  );
  const noteFileNames: string[] = [];

  // Make folders
  for (const folder of folders) {
    await mkdir(getPath(folder)).catch(() => undefined);
  }

  for (const note of notes) {
    const noteTags = tags
      .filter((t) => {
        return t.content.references.some((r) => r.uuid == note.uuid);
      })
      .map((t) => t.content.title!)
      .filter((t) => folders.includes(t));
    noteTags.push('misc');

    for (const folder of folders) {
      if (!noteTags.includes(folder)) continue;

      let fileName = `${folder}/${note.content.title.replaceAll('/', '\\')}.md`;
      if (noteFileNames.includes(fileName)) {
        fileName = `${folder}/${note.content.title.replaceAll('/', '\\')} ${
          note.uuid.split('-')[0]
        }.md`;
      }
      noteFileNames.push(fileName);

      await writeFile(getPath(fileName), note.content.text);

      await utimes(getPath(fileName), {
        btime: new Date(note.created_at).getTime(),
        mtime: new Date(note.updated_at).getTime(),
      });

      break;
    }
  }

  console.log('Converted');
}
