import { Equal, Expect } from "../helpers/type-utils";

type MappedObject<TObject extends {}> = {
  [K in keyof TObject]: (arg: K) => void;
};

export function makeEventHandlers<TObject extends {}>(
  obj: MappedObject<TObject>
) {
  return obj;
}

const obj = makeEventHandlers({
  click: (name) => {
    console.log(name);

    type test = Expect<Equal<typeof name, "click">>;
  },
  focus: (name) => {
    console.log(name);

    type test = Expect<Equal<typeof name, "focus">>;
  },
});
