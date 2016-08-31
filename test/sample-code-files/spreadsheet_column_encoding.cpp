//
/* */
/* Author: MinhThai
 * Task: spreadsheet_column_encoding
 * 7/24/2015 */
#include <iostream>
#include <fstream>
#include <io.h>

using namespace std;
ifstream fin("spreadsheet_column_encoding/test.txt");
int main() {
    int n = 0;
    fin >> n;
    cout << n << endl;
    string *a = new string[n];
    for(int i = 0; i < n; ++i) {
        getline(fin, a[i]);
        cout << a[i] << " ";
    }

    delete[] a;
    fin.close();
}