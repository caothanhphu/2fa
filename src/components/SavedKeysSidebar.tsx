import { Trash2, KeyRound } from 'lucide-react';
import { SavedKey } from '@/hooks/useSavedKeys';
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    useSidebar,
} from '@/components/ui/sidebar';

interface SavedKeysSidebarProps {
    savedKeys: SavedKey[];
    onLoadKey: (secret: string) => void;
    onDeleteKey: (id: string) => void;
    currentSecret: string;
}

export function SavedKeysSidebar({ savedKeys, onLoadKey, onDeleteKey, currentSecret }: SavedKeysSidebarProps) {
    const { setOpenMobile, isMobile } = useSidebar();

    const handleLoadKey = (secret: string) => {
        onLoadKey(secret);
        if (isMobile) {
            setOpenMobile(false);
        }
    };

    return (
        <Sidebar className="border-r border-border bg-background">
            <SidebarHeader className="border-b border-border p-4 bg-card/50 backdrop-blur-sm">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-primary" />
                    Saved Keys
                </h2>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Your Keys</SidebarGroupLabel>
                    <SidebarGroupContent>
                        {savedKeys.length === 0 ? (
                            <div className="p-4 text-center text-sm text-muted-foreground">
                                No saved keys yet.
                            </div>
                        ) : (
                            <SidebarMenu>
                                {savedKeys.map((key) => (
                                    <SidebarMenuItem key={key.id} className="group flex items-center pr-2">
                                        <SidebarMenuButton
                                            onClick={() => handleLoadKey(key.secret)}
                                            isActive={currentSecret === key.secret}
                                            className="flex-1 overflow-hidden"
                                        >
                                            <div className="flex flex-col items-start truncate overflow-hidden w-full">
                                                <span className="font-medium truncate w-full block text-left" title={key.name || 'Untitled Key'}>
                                                    {key.name || 'Untitled Key'}
                                                </span>
                                            </div>
                                        </SidebarMenuButton>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDeleteKey(key.id);
                                            }}
                                            className="p-2 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 touch-auto sm:opacity-0 focus:opacity-100"
                                            aria-label="Delete key"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        )}
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
