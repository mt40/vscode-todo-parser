a = magic(3);
%{
sum(a)
diag(a)
sum(diag(a))
%}
% todo: aaaa
sum(diag(fliplr(a)))