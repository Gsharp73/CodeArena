#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    string ans;
    while (n > 0) {
        if (n % 2) {
            ans += '1';
        }
        else {
            ans += '0';
        }
        n /= 2;
    }
    cout << ans << endl;
}