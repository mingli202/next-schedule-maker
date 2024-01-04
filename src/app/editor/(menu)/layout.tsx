import MenuNavBar from "./MenuNavBar";

type Props = {
  children: React.ReactNode;
};

const MenuLayout = ({ children }: Props) => {
  console.log("menu");

  return (
    <div className="flex h-full min-w-[20rem] flex-col gap-2 overflow-hidden rounded-md">
      <MenuNavBar className="shrink-0" />
      <div className="flex basis-full flex-col overflow-hidden rounded-md">
        {children}
      </div>
    </div>
  );
};

export default MenuLayout;
