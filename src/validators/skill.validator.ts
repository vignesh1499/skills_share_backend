export class SkillDTO {
  id?: number;
  category: string;
  experience: number;
  nature_of_work: 'onsite' | 'online';
  hourly_rate: number;
  provider_Id: string;
}
