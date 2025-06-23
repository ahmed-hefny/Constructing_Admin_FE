export interface ConfirmDialogConfig {
    header?: string;
    message?: string;
    icon?: string;
    acceptLabel?: string;
    rejectLabel?: string;
    acceptButtonStyleClass?: string;
    rejectButtonStyleClass?: string;
    acceptIcon?: string;
    rejectIcon?: string;
    acceptVisible?: boolean;
    rejectVisible?: boolean;
    closable?: boolean;
    styleClass?: string;
    width?: string;
    height?: string;
    contentStyleClass?: string;
    contentStyle?: any;
    showHeader?: boolean;
    closeOnEscape?: boolean;
    onAccept?: () => void;
    onReject?: () => void;
}