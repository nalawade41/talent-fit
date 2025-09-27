// Generate random avatar URLs from multiple sources
const avatarSources = [
  'avataaars',
  'micah',
  'adventurer',
  'adventurer-neutral',
  'big-smile',
  'bottts',
  'croodles',
  'fun-emoji',
];

export function generateRandomAvatar(seed?: string): string {
  const randomSeed = seed || Math.random().toString(36).substring(7);
  const randomSource = avatarSources[Math.floor(Math.random() * avatarSources.length)];
  return `https://api.dicebear.com/7.x/${randomSource}/svg?seed=${randomSeed}`;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}