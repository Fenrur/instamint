export function CommentFilledIcon({className, color = "#000000"}: { className?: string, color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
         strokeWidth="1.5">
      <path fillRule="evenodd" clipRule="evenodd"
            d="M1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.937 1.25 22.75 6.06293 22.75 12C22.75 17.937 17.937 22.75 12 22.75C10.1437 22.75 8.39536 22.2788 6.87016 21.4493L2.63727 22.2373C2.39422 22.2826 2.14448 22.2051 1.96967 22.0303C1.79485 21.8555 1.71742 21.6058 1.76267 21.3627L2.55076 17.1298C1.72113 15.6046 1.25 13.8563 1.25 12Z"
            fill={color}></path>
    </svg>
  )
}

export function MintFilledIcon({className}: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd"
            d="M5.19989 20.3953C5.12432 20.6752 5.04625 20.9642 4.96473 21.2631C4.81941 21.7959 4.26967 22.1101 3.73684 21.9648C3.20402 21.8194 2.88989 21.2697 3.03521 20.7369C3.11711 20.4366 3.19659 20.141 3.27481 19.8501C3.89341 17.5496 4.43255 15.5445 5.4577 13.856C6.65976 11.8761 8.47999 10.3833 11.6153 9.07691C12.1251 8.86449 12.7106 9.10557 12.923 9.61537C13.1354 10.1252 12.8944 10.7106 12.3846 10.9231C9.51993 12.1167 8.0902 13.3738 7.16728 14.894C6.29972 16.3229 5.8386 18.0304 5.19989 20.3953Z"
      />
      <path
        d="M19.7876 2.63999C13.4875 1.13059 8.1545 2.16695 4.98951 5.03284C1.93684 7.79703 1.1376 12.0409 3.15904 16.6257C3.54045 15.4554 3.98936 14.3476 4.60288 13.3371C5.94458 11.1272 7.96014 9.51658 11.2307 8.15384C12.2503 7.72901 13.4212 8.21116 13.8461 9.23076C14.2709 10.2504 13.7888 11.4213 12.7692 11.8461C10.0401 12.9833 8.80547 14.1226 8.02204 15.413C7.44205 16.3682 7.05658 17.474 6.62903 18.9706C11.9349 18.773 15.6883 17.5773 18.1717 15.2934C20.7446 12.9272 21.7683 9.56634 21.9638 5.5431C22.0302 4.17924 21.1174 2.9586 19.7876 2.63999Z"
      />
    </svg>
  )
}

export function TrashIcon({className, color}: { className?: string, color: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill={color} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
         className={className}>
      <path strokeLinecap="round" strokeLinejoin="round"
            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"/>
    </svg>
  )
}

export function ReportIcon({className, color}: { className?: string, color: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill={color} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
         className={className}>
      <path strokeLinecap="round" strokeLinejoin="round"
            d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5"/>
    </svg>
  )
}

export function EditIcon({className, color}: { className?: string, color: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill={color} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
         className={className}>
      <path strokeLinecap="round" strokeLinejoin="round"
            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
    </svg>

  )
}

export function CooksIcon({className}: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
         className={className}>
      <path strokeLinecap="round" strokeLinejoin="round"
            d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z"/>
      <path strokeLinecap="round" strokeLinejoin="round"
            d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z"/>
    </svg>

  )
}

export function MintIcon({className, strokeWidth = 2}: { className?: string, strokeWidth?: number }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4.44893 17.009C-0.246384 7.83762 7.34051 0.686125 19.5546 3.61245C20.416 3.81881 21.0081 4.60984 20.965 5.49452C20.5862 13.288 17.0341 17.7048 6.13252 17.9857C5.43022 18.0038 4.76908 17.6344 4.44893 17.009Z"
        strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3.99999 21C5.50005 15.5 6 12.5 12 9.99997" strokeWidth="2" strokeLinecap="round"
            strokeLinejoin="round"/>
    </svg>
  )
}

export function CheckIcon({className}: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="check">
      <path fill="none" d="M0 0h24v24H0V0z"></path>
      <path
        d="M9 16.17L5.53 12.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L20.29 7.71c.39-.39.39-1.02 0-1.41-.39-.39-1.02-.39-1.41 0L9 16.17z"></path>
    </svg>
  )
}
