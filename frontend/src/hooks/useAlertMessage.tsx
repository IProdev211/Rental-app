import { useSnackbar, OptionsObject } from 'notistack';

export const useAlertMessage = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const showAlertMessage = (message: any, options?: OptionsObject) => {
    const snackId = enqueueSnackbar(message, options);
    return snackId;
  };

  const closeAlertMessage = (snackId: string) => {
    closeSnackbar(snackId);
  };

  return { showAlertMessage, closeAlertMessage };
};
