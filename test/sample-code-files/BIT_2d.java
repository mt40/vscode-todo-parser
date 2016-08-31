//
/* */
package workspace;

import java.util.Scanner;
import java.io.PrintWriter;

public class BIT_2d {
    public void solve(int testNumber, Scanner in, PrintWriter out) {
        int Q = in.nextInt();
        int n = in.nextInt(), m = in.nextInt();
        int [][]a = new int[n][m];
        for(int i = 0; i < n; ++i)
            for(int j = 0; j < m; ++j)
                a[i][j] = in.nextInt();

        BIT_2D tree = new BIT_2D(a, n, m);
        while(Q-- > 0) {
            String type = in.next();
            int x = in.nextInt(), y = in.nextInt();
            if(type.equals("sum"))
                out.println(tree.sum(x, y));
            else {
                int val = in.nextInt();
                tree.update(x, y, val - a[x][y]);
            }
        }
    }

    class BIT_2D {
        int [][]tree;
        int n, m;

        public BIT_2D(int [][]matrix, int n, int m) {
            this.n = n + 1;
            this.m = m + 1;
            tree = new int[this.n][this.m];
            for(int i = 0; i < n; ++i) {
                for(int j = 0; j < m; ++j) {
                    update(i, j, matrix[i][j]);
                }
            }
        }

        void update(int x, int y, int val) {
            x++; y++; // index in BIT starts from 1

            while(x < n) {
                int j = y;
                while(j < m) {
                    tree[x][j] += val;
                    j += j & (-j);
                }
                x += x & (-x);
            }
        }

        // sum from (0,0) to (x,y)
        int sum(int x, int y) {
            x++; y++;

            int ans = 0;
            while(x > 0) {
                int j = y;
                while(j > 0) {
                    ans += tree[x][j];
                    j -= j & (-j);
                }
                x -= x & (-x);
            }

            return ans;
        }
    }
}
