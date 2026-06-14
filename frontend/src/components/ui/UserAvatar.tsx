function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(' ');
}

interface UserAvatarProps {
  src?: string | null;
  username: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  sm: 'h-6 w-6 text-[10px] rounded-md',
  md: 'h-8 w-8 text-sm rounded-xl',
  lg: 'h-10 w-10 text-base rounded-xl',
  xl: 'h-24 w-24 text-4xl rounded-2xl',
};

export const UserAvatar = ({ src, username, size = 'md', className }: UserAvatarProps) => {
  if (src) {
    return (
      <img
        src={src}
        alt={username}
        className={cn('shrink-0 object-cover', sizeMap[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center bg-gradient-to-br from-primary-500 to-purple-600 font-bold text-white shadow-md shadow-primary-500/15',
        sizeMap[size],
        className,
      )}
    >
      {username.charAt(0).toUpperCase()}
    </div>
  );
};
