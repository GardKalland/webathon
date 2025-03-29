export interface PodiumCardProps {
  position: 'first' | 'second' | 'third';
  driver: string;
  team: string;
  showPosition?: boolean;
}