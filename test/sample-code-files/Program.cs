//
/* */
using System;
using System.Collections.Generic;
using System.Diagnostics.Eventing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Azure.NotificationHubs;

namespace AzurePusher {
    class Program {
        private const string HubName = "BusMap";
        private const string ConnectionString =
            @"Endpoint=sb://busmap-ns.servicebus.windows.net/;SharedAccessKeyName=DefaultFullSharedAccessSignature;SharedAccessKey=g754E1Ia9d7Uin9RECccGMneoAZrcYW5vminZsS2uIY=";

        static void Main(string[] args) {
            (new Program()).Run();
            Console.ReadLine();
        }

        async void Run() {
            console.writeln("==========================================", ConsoleColor.DarkGray);
            console.writeln(@"
     ____            __  __             
    |  _ \          |  \/  |            
    | |_) |_   _ ___| \  / | __ _ _ __  
    |  _ <| | | / __| |\/| |/ _` | '_ \ 
    | |_) | |_| \__ \ |  | | (_| | |_) |
    |____/ \__,_|___/_|  |_|\__,_| .__/ 
                                 | |    
                                 |_|    ", ConsoleColor.DarkGray);

            Console.WriteLine("\n\tWelcome to BusMap Pusher\n");
            console.writeln("==========================================\n", ConsoleColor.DarkGray);
            Console.WriteLine("Please input your push message in 1 line:");
            console.write("  ");

            const string headline = "BusMap Team";
            string body = console.readln(ConsoleColor.Yellow);

            console.writeln();
            Console.WriteLine("Your push message is:");

            console.writeln("  " + headline, ConsoleColor.Green);
            console.writeln("  " + body, ConsoleColor.DarkGreen);

            console.writeln();
            console.write("Are you sure want to send the Notification? (Y/N)");
            string confirm = console.readln().ToLower();
            while (confirm != "y" && confirm != "n") {
                console.write("Are you sure want to send the Notification? (Y/N)");
                confirm = console.readln();
            }

            console.writeln();
            if (confirm.Equals("n")) {
                console.writeln("Push canceled.");
            }
            else {
                Console.WriteLine("Begin pushing");
                await SendNotificationAsync(headline, body);
                Console.WriteLine("Push completed!");
            }

            console.writeln();
            Console.Write("Press anykey to exit...");
            console.readln();
        }

        private async Task SendNotificationAsync(string headline, string body) {

            NotificationHubClient hub = NotificationHubClient
                .CreateClientFromConnectionString(ConnectionString, HubName);
            var toast = string.Format(@"
<toast><visual>
    <binding template=""ToastText02"">
        <text id=""1"">{0}</text>
        <text id=""2"">{1}</text>
    </binding>
</visual></toast>", headline, body);
            await hub.SendWindowsNativeNotificationAsync(toast);
            
        }
    }

    static class console {

        public static void write(object o = null, ConsoleColor color = ConsoleColor.White) {
            Console.ForegroundColor = color;
            Console.Write(o);
            Console.ResetColor();
        }

        public static void writeln(object o = null, ConsoleColor color = ConsoleColor.White) {
            Console.ForegroundColor = color;
            Console.WriteLine(o);
            Console.ResetColor();
        }

        public static string readln(ConsoleColor color = ConsoleColor.White) {
            Console.ForegroundColor = color;
            string rs = Console.ReadLine();
            Console.ResetColor();
            return rs;
        }
    }
}
