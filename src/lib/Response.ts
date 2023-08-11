export const responseSuccessWithData = (data: any) => ({ data });
export const responseSuccessWithMessage = (
  message: string = "Permintaan Berhasil Dikirimkan."
) => ({ message });

export const responseErrorWithMessage = (
  message: string = "Sepertinya terjadi masalah pada server!"
) => ({ message });
