enum UserControls {
  CubeRotateClockwise = '1',
  CubeRotateCounterclockwise = '2',
  GroupSelfRotateClockwise = '3',
  GroupSelfRotateCounterclockwise = '4',
  GroupAbsRotateClockwise = '5',
  GroupAbsRotateCounterclockwise = '6',
}

interface AngleController {
  dec: ()=> void,
  inc: ()=> void,
}

const setKeyboardListener = (
  cubeRotate: AngleController,
  groupSelfRotate: AngleController,
  groupAbsRotate: AngleController,
) => {
  document.addEventListener(
    'keydown',
    (event: KeyboardEvent) => {
      const key = event.key;
      if (key === UserControls.CubeRotateClockwise) cubeRotate.dec();
      if (key === UserControls.CubeRotateCounterclockwise) cubeRotate.inc();

      if (key === UserControls.GroupSelfRotateClockwise) groupSelfRotate.dec();
      if (key === UserControls.GroupSelfRotateCounterclockwise) groupSelfRotate.inc();

      if (key === UserControls.GroupAbsRotateClockwise) groupAbsRotate.dec();
      if (key === UserControls.GroupAbsRotateCounterclockwise) groupAbsRotate.inc();
    },
    false,
  );
}

export {
  setKeyboardListener, UserControls
}
