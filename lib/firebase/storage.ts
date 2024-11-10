import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";

export async function uploadFile(userId: string, file: File, folder: string) {
  // Upload file to Firebase Storage if it's a unique document
  const fileRef = ref(storage, `users/${userId}/${folder}/${file.name}`);
  await uploadBytes(fileRef, file);

  return await getDownloadURL(fileRef);
}

export const getResumes = async (userId: string) => {
  try {
    const listRef = ref(storage, `users/${userId}/resumes`);
    const refs = await listAll(listRef);
    const urls: { url: string; name: string }[] = [];

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
    const urls: { url: string; name: string }[] = [];

    for (const ref of refs.items) {
      const url = await getDownloadURL(ref);
      urls.push({ url: url, name: ref.name });
    }
    return urls;
  } catch (err) {
    console.log(err);
  }
};
