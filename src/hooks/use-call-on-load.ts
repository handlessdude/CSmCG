import { Nullable } from 'src/models/generic';
import { Ref, watch, WatchCallback, WatchOptions } from 'vue';

const useCallOnLoad = <T>(
  r: Ref<Nullable<T>>,
  callback: WatchCallback,
  options: WatchOptions = {}
) => {
  console.log('hello');
  const stopWatch = watch(
    r,
    (...params) => {
      if (!params[0]) {
        return;
      }
      stopWatch();
      callback(...params);
    },
    options
  );
};

export { useCallOnLoad };
