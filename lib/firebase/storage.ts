import { storage } from "./firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  StorageReference,
} from "firebase/storage";

export const uploadFile = async (
  userId: string,
  file: File,
  folder: string,
) => {
  try {
    const fileRef = ref(storage, `users/${userId}/${folder}/${file.name}`);
    await uploadBytes(fileRef, file);
    return await getDownloadURL(fileRef);
  } catch (err) {
    console.log(err);
  }
};

export const getResumes = async (userId: string) => {
  try {
    const listRef = ref(storage, `users/${userId}/resumes`);
    const refs = await listAll(listRef);
    let urls: { url: string; name: string }[] = [];

    for (const ref of refs.items) {
      const url = await getDownloadURL(ref);
      urls.push({ url: url, name: ref.name });
    }
    return urls;
  } catch (err) {
    console.log(err);
  }
};

export const getCoverLetters = async (userId: string) => {
  try {
    const listRef = ref(storage, `users/${userId}/cover-letters`);
    const refs = await listAll(listRef);
    let urls: { url: string; name: string }[] = [];

    for (const ref of refs.items) {
      const url = await getDownloadURL(ref);
      urls.push({ url: url, name: ref.name });
    }
    return urls;
  } catch (err) {
    console.log(err);
  }
};
