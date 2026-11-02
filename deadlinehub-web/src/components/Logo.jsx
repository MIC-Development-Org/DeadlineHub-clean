import { CalendarDays, Check } from 'lucide-react';

export default function Logo() {
    return (
        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-white">
            <CalendarDays size={25} strokeWidth={2} />
            <Check
                size={13}
                strokeWidth={3}
                className="absolute bottom-1 right-1 rounded-full bg-white text-violet-600"
            />
        </div>
    );
}