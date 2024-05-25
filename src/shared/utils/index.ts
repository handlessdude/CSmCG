import { computed } from 'vue';

const makeVModelFromProps = <IProps, EmitOption>(
  propName: keyof IProps,
  props: IProps,
  emit: (event: EmitOption, ...args: any[]) => void
) =>
  computed({
    get: () => props[propName],
    set: (value: IProps[keyof IProps]) =>
      emit(`update:${String(propName)}` as EmitOption, value),
  });

const randsign = () => Math.random() < 0.5? -1 : 1;

export { makeVModelFromProps, randsign };
