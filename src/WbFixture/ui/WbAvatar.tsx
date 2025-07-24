interface WbAvatarProps {
  src: string;
  size: number | string;
  padding?: number;
  borderColor?: string;
  new?: boolean;
}

export const WbAvatar = ({ padding = 12, ...props }: WbAvatarProps) => {
  const sizeStyle = typeof props.size === 'number' ? `${props.size}px` : props.size;
  
  if (props.new)
    return (
      <div
        className="flex items-center justify-center rounded-full overflow-hidden bg-white"
        style={{
          height: sizeStyle,
          width: sizeStyle,
          padding: padding,
        }}
      >
        <img src={props.src} alt="" className="object-contain" />
      </div>
    );
  
  return (
    <div
      className="flex items-center justify-center rounded-full overflow-hidden"
      style={{
        width: sizeStyle,
        height: sizeStyle,
        backgroundColor: "white",
        borderColor: props.borderColor || "white",
        borderWidth: "2px",
        borderStyle: "solid",
      }}
    >
      <img 
        src={props.src} 
        alt="" 
        className="w-full h-full object-cover rounded-full"
      />
    </div>
  );
};
