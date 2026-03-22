```bash
bash scripts/upload-doc-images-to-r2.sh \
    --remote maayuan-docs-r2 \
    --bucket maayuan \
    --prefix docs \
    --rewrite-markdown \
    --public-base-url https://files.maayuan.top
```

```bash
bash scripts/merge-pr-with-opencommit.sh 26
```
