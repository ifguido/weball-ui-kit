import { Avatar } from "@chakra-ui/react";

interface WbAvatarProps {
  src: string;
  size: number | string;
  padding?: number;
  borderColor?: string;
  new?: boolean;
}

export const WbAvatar = ({ padding = 12, ...props }: WbAvatarProps) => {
  if (props.new)
    return (
      <div
        className="flex items-center justify-center rounded-full overflow-hidden bg-white"
        style={{
          height: props.size,
          width: props.size,
          padding: padding,
        }}
      >
        <img src={props.src} alt="" className="object-contain" />
      </div>
    );
  return (
    <Avatar
      src={props.src}
      width={props.size}
      height={props.size}
      background="white"
      borderColor={props.borderColor || "white"}
    />
  );
};
