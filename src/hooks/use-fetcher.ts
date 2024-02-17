import { Ref, ref } from 'vue';
import { Nullable } from 'src/models/generic';

const useFetcher = <T>(callback: (...params: any[]) => Promise<T>) => {
  const isLoading = ref(false);
  const data: Ref<Nullable<T>> = ref(null);

  const triggerFetch = async (...params: any[]) => {
    try {
      isLoading.value = true;
      data.value = await callback(params);
      isLoading.value = false;
    } catch (e) {
      console.log(e);
    }
  };
  return {
    isLoading,
    triggerFetch,
    data,
  };
};

export { useFetcher };
