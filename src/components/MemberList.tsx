import { members } from './data';

export function MemberItem({ member }: { member: typeof members[0] }) {
  return (
    <div className="h-full flex flex-col justify-center">
      <h3 className="text-xl font-bold text-white">{member.name}</h3>
      <p className="text-gray-400">{member.role}</p>
    </div>
  );
}

export default function MemberList() {
  return (
    <>
      {members.map((member) => (
        <MemberItem key={member.id} member={member} />
      ))}
    </>
  );
}