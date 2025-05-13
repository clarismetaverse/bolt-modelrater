export async function uploadImageForRating(file: File): Promise<any> {
  const formData = new FormData();
  formData.append('Picture', file);

  const res = await fetch('https://xbut-eryu-hhsg.f2.xano.io/api:TAf2tJRT/SendPicModelRater', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error(`Server responded with ${res.status}: ${res.statusText}`);
  }

  return res.json();
}
