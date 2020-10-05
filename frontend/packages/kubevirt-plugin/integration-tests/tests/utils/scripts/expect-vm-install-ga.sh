#!/usr/bin/expect -f

set vm_name [lindex $argv 0]
set vm_namespace [lindex $argv 1]
set hostname [lindex $argv 2]
set username fedora
set password fedora

set login_prompt "$vm_name login: "
set password_prompt "Password: "
set prompt "$"

set response_delay 10
set send_human {.1 .3 1 .05 2}

spawn virtctl console $vm_name -n $vm_namespace --timeout 7

sleep 10

send -h "\n"


# Send ctrl + D preventively to make sure user is logged out
send -h \004

set timeout 300

# Enter username
expect $login_prompt {
    sleep $response_delay
    send -h "$username\n"
}

# Enter Password
expect $password_prompt {
    sleep $response_delay
    send -h "$password\n"
}

# Run tests
expect $prompt {
    sleep $response_delay
    
    send -h "echo hello \n";
    

}

# exit to login prompt
expect $prompt {
    send -h \004
    expect -re $login_prompt
}

# exit console
send \003]
